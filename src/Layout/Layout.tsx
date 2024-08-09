import NavBar from "../components/NavBar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className=" flex flex-col gap-3">
      <NavBar />
      {children}
    </div>
  );
}
