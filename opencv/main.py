import cv2
import pickle

import zlib
import binascii

cap = cv2.VideoCapture(0)
encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]

currentFrame = 0
while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()

    data = pickle.dumps(frame)
    print(len(data))

    frame = pickle.loads(data)

    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    currentFrame += 1

cap.release()
cv2.destroyAllWindows()