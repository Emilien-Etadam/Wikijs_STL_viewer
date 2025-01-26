# WikiJS STL Viewer
Easily add an STL viewer to Wiki.js 2.5 for 3D model visualization.

## Installation

1. Go to **Administration > Theme** in the Wiki.js admin panel.

2. Copy/paste the code from `HTML_head.js` into the **second injection code frame** (right column).

3. Copy/paste the code from `HTML_body.js` into the **third injection code frame** (right column).

4. Click the **Apply** button in the top-right corner to save changes.

5. Create or edit a page, and upload the STL file (the same way you upload images).

6. In the page where you want to display the STL file, add the following HTML snippet:

   ```html
   <div class="stl-viewer" data-src="/PATH_TO_YOUR_FILE.stl" style="width: 100%; height: 500px;"></div>

7. Result:
   ![waterfox_07TNsS7TDN](https://github.com/user-attachments/assets/c3baedb0-5df5-4532-8865-c4eed5f36fcd)
