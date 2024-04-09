# Telegram bot for classeviva

## To run locally (node):

```bash
yarn install && yarn run build && yarn start
```

## To run locally (docker):

```bash
docker compose --env-file .env up --build -d
```

#### <b>Note</b>: The hosting server should have an italian IP otherwhise classeviva login api will return an invalid response

<br />

# Working example: [Here](https://t.me/classeviva_voti_bot)

## Commands:

    /help : list all available commands
    /info : show logged user info
    /login : login to your classeviva account
    /logout : logout from your classeviva account
    /grades : show all your logged account grades
    /subscribegrades : subscribe to new grades and receive notifications
    /unsubscribegrades : unsubscribe from receiving grade notifications

## Grade notification example:

<img src="./notification.jpg">
