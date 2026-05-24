const start = document.querySelector<HTMLButtonElement>("#start");
const stop = document.querySelector<HTMLButtonElement>("#stop");
const targetLanguage = document.querySelector<HTMLInputElement>("#targetLanguage");
const remoteAudio = document.querySelector<HTMLAudioElement>("#remoteAudio");
const log = document.querySelector<HTMLPreElement>("#log");

let peerConnection: RTCPeerConnection | undefined;

function write(message: string) {
  if (log) {
    log.textContent += `${message}\n`;
  }
}

start?.addEventListener("click", async () => {
  const sessionResponse = await fetch("/translation-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetLanguage: targetLanguage?.value ?? "es" })
  });
  const session = await sessionResponse.json();
  const token = session.client_secret?.value;
  if (!token) {
    throw new Error("No ephemeral Realtime token returned.");
  }

  peerConnection = new RTCPeerConnection();
  peerConnection.ontrack = (event) => {
    if (remoteAudio) {
      remoteAudio.srcObject = event.streams[0];
    }
  };

  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  for (const track of mediaStream.getTracks()) {
    peerConnection.addTrack(track, mediaStream);
  }

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const sdpResponse = await fetch("https://api.openai.com/v1/realtime/translations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/sdp"
    },
    body: offer.sdp
  });

  const answer = { type: "answer" as const, sdp: await sdpResponse.text() };
  await peerConnection.setRemoteDescription(answer);
  write("Live translation started.");
});

stop?.addEventListener("click", () => {
  peerConnection?.close();
  peerConnection = undefined;
  write("Live translation stopped.");
});
