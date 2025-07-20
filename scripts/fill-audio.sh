
#!/bin/sh
set -e

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

  # Add audioBase64 to the question in the JSON file
  jq ".questions[$i].audioBase64 = \"$AUDIO_BASE64\"" "$DB_FILE" > "$DB_FILE.tmp" && mv "$DB_FILE.tmp" "$DB_FILE"
done


