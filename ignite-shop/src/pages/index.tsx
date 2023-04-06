import { styled } from "../styles";

const Button = styled("button", {
  backgroundColor: "$rocketseat",
});

export default function Home() {
  return (
    <div>
      <h1>Hello world</h1>
      <Button>button</Button>
    </div>
  );
}
