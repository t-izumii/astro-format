import Picture from "../../ui/picture";

export default function Pages() {
  return (
    <div>
      <h2>TOP</h2>

      <Picture
        src="/images/sample.jpg"
        alt="Sample Image"
        width={600}
        height={400}
      />
    </div>
  );
}
