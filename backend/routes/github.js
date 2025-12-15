const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/import", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl || !repoUrl.includes("github.com")) {
      return res.status(400).json({ message: "Invalid GitHub URL" });
    }

    const parts = repoUrl
      .replace("https://github.com/", "")
      .replace(/\/$/, "")
      .split("/");

    const owner = parts[0];
    const repo = parts[1];


    const metaResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          "User-Agent": "doc-generator",
          Authorization: process.env.GITHUB_TOKEN
            ? `Bearer ${process.env.GITHUB_TOKEN}`
            : undefined,
        },
      }
    );

    if (!metaResp.ok) {
      return res.status(404).json({ message: "Repo not found or private" });
    }

    const meta = await metaResp.json();
    const branch = meta.default_branch;

    
    const zipUrl = `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`;
    const zipResp = await fetch(zipUrl);

    if (!zipResp.ok) {
      return res.status(500).json({ message: "Failed to download repo ZIP" });
    }

    const buffer = await zipResp.buffer();

    res.setHeader("Content-Type", "application/zip");
    res.send(buffer);
  } catch (err) {
    console.error("GitHub import error:", err);
    res.status(500).json({ message: "GitHub import failed" });
  }
});

module.exports = router;
