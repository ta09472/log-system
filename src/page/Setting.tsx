import Layout from "../Layout/Layout";
import customLocalStorage from "../util/localstorage";

export default function Setting() {
  console.log(customLocalStorage.getItem("form"));
  return (
    <Layout>
      할지말지 고민중
      <br />
      /api/aggregation/listAll 전체 조회하고 여기서 /api/aggregation api 써서
      설정을 바꾸는 기능
      <br />
      근데 과연 한곳에서 설정을바꾸는 페이지가 필요할까?
      <br />
      각각의 tab에서 수정할 수 있도록 하면 되지 않을까?
    </Layout>
  );
}
