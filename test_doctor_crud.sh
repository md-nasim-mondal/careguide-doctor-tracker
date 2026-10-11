#!/bin/bash
set -eo pipefail

BASE_URL="http://localhost:5000/api/v1"

echo "========================================================"
echo " Running Doctor CRUD and Relationship Verification Tests"
echo "========================================================"

# Helper for HTTP requests asserting status code
call_api() {
  local method="$1"
  local endpoint="$2"
  local token="$3"
  local data="$4"
  local expected_status="$5"

  local headers=("-H" "Content-Type: application/json")
  if [ -n "$token" ]; then
    headers+=("-H" "Authorization: $token")
  fi

  local resp_file=$(mktemp)
  local status_code

  if [ -n "$data" ]; then
    status_code=$(curl -s -o "$resp_file" -w "%{http_code}" -X "$method" "${headers[@]}" -d "$data" "$BASE_URL$endpoint")
  else
    status_code=$(curl -s -o "$resp_file" -w "%{http_code}" -X "$method" "${headers[@]}" "$BASE_URL$endpoint")
  fi

  local body=$(cat "$resp_file")
  rm -f "$resp_file"

  if [ "$status_code" -ne "$expected_status" ]; then
    echo "❌ Assertion failed on $method $endpoint: Expected HTTP $expected_status, got $status_code"
    echo "Response body: $body"
    exit 1
  fi

  echo "$body"
}

# 1. Login to get token
echo "[1/8] Express Direct Auth - Login as Super Admin..."
LOGIN_RESP=$(call_api "POST" "/auth/login" "" '{"email":"admin@example.com","password":"admin_password_123"}' 200)
TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.accessToken')
if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Failed to parse access token"
  exit 1
fi
echo "✅ Login successful, token obtained."

# 2. Create Doctor
echo "[2/8] Create Doctor..."
CREATE_RESP=$(call_api "POST" "/doctors" "$TOKEN" '{"name":"Dr. Assertion Test","specialization":"Neurology","hospital":"Central Clinic","phone":"1122334455","email":"assert_doc@example.com"}' 201)
DOC_ID=$(echo "$CREATE_RESP" | jq -r '.data._id')
DOC_NAME=$(echo "$CREATE_RESP" | jq -r '.data.name')
if [ -z "$DOC_ID" ] || [ "$DOC_NAME" != "Dr. Assertion Test" ]; then
  echo "❌ Doctor creation verification failed"
  exit 1
fi
echo "✅ Doctor created with ID: $DOC_ID, Name: $DOC_NAME (HTTP 201)"

# 3. Update Doctor & Verify DB Persistence
echo "[3/8] Update Doctor & Check Persistence..."
UPDATE_RESP=$(call_api "PUT" "/doctors/$DOC_ID" "$TOKEN" '{"name":"Dr. Assertion Updated","hospital":"Metro Hospital"}' 200)
UPDATED_NAME=$(echo "$UPDATE_RESP" | jq -r '.data.name')
UPDATED_HOSPITAL=$(echo "$UPDATE_RESP" | jq -r '.data.hospital')
if [ "$UPDATED_NAME" != "Dr. Assertion Updated" ] || [ "$UPDATED_HOSPITAL" != "Metro Hospital" ]; then
  echo "❌ Doctor update response fields mismatch"
  exit 1
fi

# Verify persisted state via GET
GET_RESP=$(call_api "GET" "/doctors/$DOC_ID" "$TOKEN" "" 200)
PERSISTED_NAME=$(echo "$GET_RESP" | jq -r '.data.name')
PERSISTED_HOSPITAL=$(echo "$GET_RESP" | jq -r '.data.hospital')
if [ "$PERSISTED_NAME" != "Dr. Assertion Updated" ] || [ "$PERSISTED_HOSPITAL" != "Metro Hospital" ]; then
  echo "❌ Persisted database state mismatch"
  exit 1
fi
echo "✅ Doctor updated and persisted in DB (HTTP 200)"

# 4. Attempt update with nonexistent ID (should return 404)
echo "[4/8] Update Nonexistent Doctor (Assert 404)..."
NONEXISTENT_RESP=$(call_api "PUT" "/doctors/6aca79f228d0bff638187000" "$TOKEN" '{"name":"Ghost"}' 404)
ERR_MSG=$(echo "$NONEXISTENT_RESP" | jq -r '.message')
if [ "$ERR_MSG" != "Doctor not found" ]; then
  echo "❌ Expected 'Doctor not found', got: $ERR_MSG"
  exit 1
fi
echo "✅ Nonexistent doctor update returned HTTP 404 and correct error message"

# 5. Delete doctor without patients
echo "[5/8] Delete Doctor Without Patients..."
DELETE_RESP=$(call_api "DELETE" "/doctors/$DOC_ID" "$TOKEN" "" 200)
# Verify doctor no longer exists
GET_AFTER_DELETE=$(call_api "GET" "/doctors/$DOC_ID" "$TOKEN" "" 200)
DOC_AFTER_DELETE=$(echo "$GET_AFTER_DELETE" | jq -r '.data')
if [ "$DOC_AFTER_DELETE" != "null" ]; then
  echo "❌ Doctor still exists after deletion"
  exit 1
fi
echo "✅ Doctor deleted successfully and confirmed deleted in DB (HTTP 200)"

# 6. Guard: Block delete doctor when associated patients exist
echo "[6/8] Block Delete Doctor With Patients (Assert 400)..."
CREATE_DOC2=$(call_api "POST" "/doctors" "$TOKEN" '{"name":"Dr. Guard Test","specialization":"Cardiology","hospital":"Heart Center","phone":"9988776655","email":"guard_doc@example.com"}' 201)
DOC2_ID=$(echo "$CREATE_DOC2" | jq -r '.data._id')

CREATE_PAT=$(call_api "POST" "/patients" "$TOKEN" "{\"name\":\"Protected Patient\",\"age\":30,\"condition\":\"Arrhythmia\",\"doctor\":\"$DOC2_ID\"}" 201)
PAT_ID=$(echo "$CREATE_PAT" | jq -r '.data._id')

# Attempt deleting doctor with associated patient -> must fail with 400
DELETE_FAIL_RESP=$(call_api "DELETE" "/doctors/$DOC2_ID" "$TOKEN" "" 400)
GUARD_MSG=$(echo "$DELETE_FAIL_RESP" | jq -r '.message')
echo "Blocked delete response: $GUARD_MSG"

# Verify patient and relationship remain completely intact
GET_PAT=$(call_api "GET" "/patients?search=Protected%20Patient" "$TOKEN" "" 200)
PAT_DOC_ID=$(echo "$GET_PAT" | jq -r '.data.patients[0].doctor._id')
if [ "$PAT_DOC_ID" != "$DOC2_ID" ]; then
  echo "❌ Patient doctor relationship was compromised"
  exit 1
fi
echo "✅ Deletion blocked (HTTP 400) and patient relationship confirmed intact in DB"

# 7. Clean up test records
echo "[7/8] Clean Up Records..."
call_api "DELETE" "/patients/$PAT_ID" "$TOKEN" "" 200 > /dev/null
call_api "DELETE" "/doctors/$DOC2_ID" "$TOKEN" "" 200 > /dev/null
echo "✅ Test records cleaned up"

# 8. Unauthenticated Request (Assert 401)
echo "[8/8] Unauthenticated Request Check (Assert 401)..."
UNAUTH_RESP=$(call_api "GET" "/doctors" "" "" 401)
echo "✅ Direct Express API unauthenticated request correctly rejected with HTTP 401"

echo "========================================================"
echo " All Doctor CRUD Assertions Passed Successfully!       "
echo "========================================================"
