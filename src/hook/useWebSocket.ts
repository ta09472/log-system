import { useEffect, useState } from "react";

export default function useWebSocket() {
  const socket = new WebSocket("ws://211.225.158.78:8080/ws");
  const [message, setMessage] = useState({});
  useEffect(() => {
    // WebSocket 연결 설정

    // WebSocket 연결이 열릴 때
    socket.onopen = () => {
      console.log("WebSocket connected");
      // setWs(socket);
    };

    // WebSocket 메시지를 받을 때
    socket.onmessage = event => {
      const message = event.data;
      // setMessages((prevMessages) => [...prevMessages, message]);
      //   console.log(message);

      setMessage(JSON.parse(message));
    };

    // WebSocket 연결이 닫힐 때
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // WebSocket 오류 발생 시
    socket.onerror = error => {
      console.error("WebSocket error:", error);
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 닫기
    return () => {
      socket.close();
    };
  }, []);

  return { message };
}
