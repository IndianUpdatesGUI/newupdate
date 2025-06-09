import requests
import json

def SendPushNotification(server_key, device_token, title, message):
    url = 'https://fcm.googleapis.com/fcm/send'

    headers = {
        'Authorization': 'key=BH29N_jZscPwodEIDT0aC7o9l_WGmepP5cS31BViAYrG0xGaPrryFpA_zx7z0eLnJc1zTs0FihVttH2a3J5AihM',

        'Content-Type': 'application/json'
    }

    payload = {
        'to': device_token,
        'notification': {
            'title': title,
            'body': message
        },
        'priority': 'high'
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    print(response.status_code)
    print(response.text)


# Example call to the function — this is where the magic begins

server_key = 'BH29N_jZscPwodEIDT0aC7o9l_WGmepP5cS31BViAYrG0xGaPrryFpA_zx7z0eLnJc1zTs0FihVttH2a3J5AihM'  # Replace this
device_token = 'fTq9Zc1xBkg:APA91bFvS4-v5qXB_Hf...qABsM-dtNz'   # Replace this
title = 'Hello from Python!'
message = 'This is a test push notification.'

SendPushNotification(server_key, device_token, title, message)
