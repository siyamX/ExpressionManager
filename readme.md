# Expression Manager ✨

Save and copy your favorite After Effects expressions without switching to Notepad.

## About

I'm a video editor and got tired of opening Notepad every time I needed my favorite expressions. Couldn't find a good solution, so I built this.

I'm not a programmer—the code might be messy, but it works! This is open source, so feel free to modify it or suggest features.

**Connect:** [LinkedIn](https://www.linkedin.com/in/siyamedits/) • [Twitter](https://x.com/siyamedits) • [Website](https://siyamedits.com/)

## Installation

1. Click **`<> Code`** → **Download ZIP**
2. Extract and copy the **ExpressionManager** folder
3. Paste it here: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`
4. Open After Effects → **Window** → **Extensions** → **ExpressionManager**

## Extension Not Showing?

After Effects needs a registry edit to show unsigned extensions.

**Quick Steps:**

1. Press **Win + R**, type `regedit`, hit OK
2. Go to: `Computer\HKEY_CURRENT_USER\Software\Adobe`
3. Find the CSXS folder with the highest number (like `CSXS.12`)
   - **No CSXS folder?** Ask ChatGPT which number to create for your AE version, then create that folder
4. Right-click the CSXS folder → **New** → **String Value**
5. Name it `PlayerDebugMode` with value `1`

That's it! Restart After Effects.

---

**Like it? Give it a ⭐ on GitHub!**
