import requests
import json

def SendPushNotification(server_key, device_token, title, message):
    url = 'https://fcm.googleapis.com/fcm/send'

    headers = {
        'Authorization': 'BJLPfJ6DFU-ig_k_of9HA8H2wI6bWxe00bsmwl2_BHIIPyJZbHE5r0WWVrpmupATAtGMk4dKqnBpHoRxrR3i49M}',
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

server_key = 'BJLPfJ6DFU-ig_k_of9HA8H2wI6bWxe00bsmwl2_BHIIPyJZbHE5r0WWVrpmupATAtGMk4dKqnBpHoRxrR3i49M'  # Replace this
device_token = 'fTq9Zc1xBkg:APA91bFvS4-v5qXB_Hf...qABsM-dtNz'   # Replace this
title = 'Hello from Python!'
message = 'This is a test push notification.'

SendPushNotification(server_key, device_token, title, message)
