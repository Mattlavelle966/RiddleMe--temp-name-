import { MediaClient } from "./mediaClient";
import { connectToUserSocket } from "./socket";

export async function requestCall(userId: string) {
  return await connectToUserSocket(userId);
}

export async function startActiveCallMedia(mediaClient: MediaClient) {
  mediaClient.onRemoteStream = ({ stream, producerId }) => {
    console.log("remote stream arrived", producerId, stream);

    const audio = document.createElement("audio");
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.controls = true;
    audio.muted = false;

    document.body.appendChild(audio);

    audio.play().then(() => {
      console.log("audio playing");
    }).catch((err) => {
      console.log("audio play failed", err);
    });
  };

  console.log("mic init");
  await mediaClient.init();

  console.log("startMic");
  await mediaClient.startMic();

  console.log("begin consumption");
  await mediaClient.consumeExistingProducers();
}

export async function acceptIncomingCallSession(mediaClient: MediaClient, callId: string) {
  const result = await mediaClient.acceptCall(callId);

  if (!result?.ok) {
    console.log("accept failed");
    return;
  }

  await startActiveCallMedia(mediaClient);
}

export async function declineIncomingCallSession(mediaClient: MediaClient, callId: string) {
  await mediaClient.declineCall(callId);
}
