// Shared fixed backdrop for all inner pages — deep aquatic green gradient
// with animated god rays and a vignette, matching the homepage design.
// Pure CSS (see globals.css .page-ambience) so it can render on the server.
export default function PageAmbience() {
  return (
    <div className="page-ambience" aria-hidden="true">
      <div className="pa-glow" />
      <div className="pa-ray pa-ray1" />
      <div className="pa-ray pa-ray2" />
      <div className="pa-ray pa-ray3" />
      <div className="pa-vignette" />
    </div>
  );
}
