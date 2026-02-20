#!/bin/bash

OBJECT_ID=${1:?Usage: ./test-webhook.sh <object_id> [--local]}

if [[ "$2" == "--local" ]]; then
  URL="http://127.0.0.1:54381/functions/v1/strava-webhook"
else
  URL="https://lcznqhfllcgmbtfexmmw.supabase.co/functions/v1/strava-webhook"
fi

curl -i "$URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"aspect_type\": \"update\",
    \"event_time\": 1516126040,
    \"object_id\": $OBJECT_ID,
    \"object_type\": \"activity\",
    \"owner_id\": 28437315,
    \"subscription_id\": 120475,
    \"updates\": {
      \"title\": \"Messy\"
    }
  }"
