import React from "react";

export default function VideoEmbed() {
  const videoId = "41Bt4eOg6HU"; // use a video that allows embedding

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>YouTube Video</h2>

      <div
        style={{
          position: "relative",
          paddingTop: "56.25%", // 16:9
          backgroundColor: "#000",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
