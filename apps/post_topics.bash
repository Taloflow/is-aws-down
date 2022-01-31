# set below env before running
# VOTING_API_KEY
# APP_RUNNER_DOMAIN_VOTING_API

topic1='{
    "is_active": "true", 
    "title": "You walk into a bar with a Crypto buyer, Rust programmer and Arch Linux user, who tells you who they are first?", 
    "choices": [
        {
        "description": "Arch",
        "id": "bbc26f13-91ac-4c82-959e-2b5bb05dabf1"
      },
      {
        "description": "Rust",
        "id": "4120e458-2df9-4e65-8dd0-aa02fbc9e70b"
      },
      {
        "description": "Crypto",
        "id": "25066362-8499-40a5-b052-db10fea2504a"
      }
    ],
    "api_key": "VOTING_API_KEY"
}'

topic1=`echo $topic1 | sed "s/VOTING_API_KEY/$VOTING_API_KEY/g"`

topic2='{
    "is_active": "true", 
    "title": "I want to quit working computers and become a...", 
    "choices": [
       {
        "description": "🪓 Woodworker",
        "id": "6042f664-fac3-4c4a-bf3d-9646b33f9d73"
      },
      {
        "description": "🧁 Baker",
        "id": "77c4a8ff-48cf-4f47-9c89-007ccfe487fe"
      },
      {
        "description": "👩‍🌾 Farmer",
        "id": "5e3fc1b1-6a6d-4aa8-b8e2-4454aeadb1d5"
      },
      {
        "description": "👨‍🍳 Chef",
        "id": "f3d75639-691a-47a5-8b46-beeb12ea2d3e"
      }
    ],
    "api_key": "VOTING_API_KEY"
}'

topic1=`echo $topic1 | sed "s/VOTING_API_KEY/$VOTING_API_KEY/g"`
topic2=`echo $topic2 | sed "s/VOTING_API_KEY/$VOTING_API_KEY/g"`

echo $topic1

echo $topic2

curl -X POST -H "Content-Type: application/json" \
    -d "$topic1" \
    https://$APP_RUNNER_DOMAIN_VOTING_API/topics

curl -X POST -H "Content-Type: application/json" \
    -d "$topic2" \
    https://$APP_RUNNER_DOMAIN_VOTING_API/topics

