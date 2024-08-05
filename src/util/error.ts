export class CustomError extends Error {
  public status: number;
  public details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.details = details;

    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, CustomError);
    // }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function errorHandleByCode(error: any) {
  switch (error.response?.data.error.status) {
    case 400:
      // API 명세가 바뀌었을경우 에러 발생 가능
      // 해당 애플리케이션에서는 사용자가 대응할 수 있는 방법 없음
      // 노티 하나 띄워주기
      throw new CustomError("잘못된 요청입니다.", 400);
    case 401:
      throw new CustomError("인증이 필요합니다.", 401);
    case 403:
      throw new CustomError("접근이 제한되었습니다.", 403);
    case 404:
      // API 명세가 바뀌었을경우 에러 발생 가능
      // 해당 애플리케이션에서는 사용자가 대응할 수 있는 방법 없음
      // 노티 하나 띄워주기
      throw new CustomError("리소스가 없거나 이동하였습니다.", 404);

    case 500:
      // ai 요약 요청했을때 에러 발생 가능
      // 해당 애플리케이션에서는 사용자가 대응할 수 있는 방법이 없음
      // 노티 하나 띄워주기
      throw new CustomError("서버에 오류가 발생했습니다.", 500);
    default:
      throw new CustomError("알 수 없는 오류입니다.", 10000);
  }
}
