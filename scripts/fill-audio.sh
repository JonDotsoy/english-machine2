#!/bin/sh

set -e


# Audios file path
AUDIO_JSON_PATH="src/dbs/assets/audios.json"
# Validate src/dbs/assets/audios.json exists
if [ ! -f "$AUDIO_JSON_PATH" ]; then
  echo "Error: $AUDIO_JSON_PATH does not exist."
  exit 1
fi

# Validate GTTS_CLI_PATH is set
if [ -z "$GTTS_CLI_PATH" ]; then
  echo "Error: GTTS_CLI_PATH environment variable is not set."
  exit 1
fi


# Validate at least one argument is provided
if [ $# -eq 0 ]; then
  echo "Error: No arguments provided. Usage: $0 <db_file>"
  exit 1
fi

# Store first argument in DB_FILE
DB_FILE="$1"


# Validate DB_FILE exists
if [ ! -f "$DB_FILE" ]; then
  echo "Error: File '$DB_FILE' does not exist."
  exit 1
fi

# Get audioSupported value from DB_FILE
AUDIO_SUPPORTED=$(jq -r '.audioSupported' "$DB_FILE")


# Validate AUDIO_SUPPORTED is true
if [ "$AUDIO_SUPPORTED" != "true" ]; then
  echo "Error: audioSupported is not enabled in '$DB_FILE'."
  exit 1
fi

# Iterate over each question in the file
QUESTION_COUNT=$(jq '.questions | length' "$DB_FILE")

for i in $(seq 0 $((QUESTION_COUNT - 1))); do
  QUESTION=$(jq -r ".questions[$i].question" "$DB_FILE" | sed 's/___/.../g')
  ANSWER=$(jq -r ".questions[$i].answer" "$DB_FILE")
  echo "Processing question $((i+1))/$QUESTION_COUNT: $QUESTION"

  # Generate base64 audio for the question text
  AUDIO_BASE64=$($GTTS_CLI_PATH "$QUESTION" | base64 -b 0)

  # Save base64 audio in audios.json under audios property, using a unique key (e.g., question text hash)
  # Use sha256sum to generate a key from the question text
  AUDIO_KEY=$(echo -n "$QUESTION" | tr '[:upper:]' '[:lower:]' | sha256sum | awk '{print $1}')

  # Only write if the key does not exist
  AUDIO_EXISTS=$(jq -r ".audios[\"$AUDIO_KEY\"]" "$AUDIO_JSON_PATH")

  if [ "$AUDIO_EXISTS" = "null" ]; then
    jq ".audios[\"$AUDIO_KEY\"] = \"$AUDIO_BASE64\"" "$AUDIO_JSON_PATH" > "$AUDIO_JSON_PATH.tmp" && mv "$AUDIO_JSON_PATH.tmp" "$AUDIO_JSON_PATH"
  fi
done


