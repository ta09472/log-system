import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

interface Props {
  topicName: string;
  searchType: "raw" | "agg";
}

export default function useWebSocket({ topicName, searchType }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [message, setMessage] = useState<any>({});

  const client = new Client({
    brokerURL: `ws://211.225.158.78:8080/ws`, // 기본 WebSocket URL
    reconnectDelay: 5000, // 연결 실패 시 5초 후 재시도
    onConnect: () => {
      console.log("WebSocket connected with STOMP");

      // 특정 토픽에 구독
      client.subscribe(`/topic/${searchType}/${topicName}`, message => {
        const parsedMessage = JSON.parse(message.body);
        setMessage(parsedMessage);
      });
    },
    onStompError: frame => {
      console.error("STOMP error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    },
  });

  useEffect(() => {
    // STOMP 클라이언트 설정

    client.activate(); // STOMP 클라이언트 활성화
    console.log(message);
    // 컴포넌트 언마운트 시 WebSocket 연결 닫기
    return () => {
      client.deactivate();
      console.log("WebSocket disconnected");
    };
  }, [topicName, searchType]);

  return { message };
}
