document.addEventListener('DOMContentLoaded', () => {
    const arrayInput = document.getElementById('arrayInput');
    const visualizeBtn = document.getElementById('visualizeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const outputUnits = document.getElementById('outputUnits');
    const svgContainer = document.getElementById('svgContainer');

    function calculateWaterTank(heights) {
        const n = heights.length;
        if (n === 0) return { totalWater: 0, waterDetails: [] };

        const leftMax = new Array(n);
        const rightMax = new Array(n);
        const waterDetails = new Array(n).fill(0);

        leftMax[0] = heights[0];
        for (let i = 1; i < n; i++) {
            leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
        }

        rightMax[n - 1] = heights[n - 1];
        for (let i = n - 2; i >= 0; i--) {
            rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
        }

        let totalWater = 0;
        for (let i = 0; i < n; i++) {
            const trapped = Math.min(leftMax[i], rightMax[i]) - heights[i];
            waterDetails[i] = trapped > 0 ? trapped : 0;
            totalWater += waterDetails[i];
        }

        return { totalWater, waterDetails };
    }

    function renderSVG(heights, waterDetails) {
        const n = heights.length;
        if (n === 0) {
            svgContainer.innerHTML = '<p>No data to display</p>';
            return;
        }

        const maxH = Math.max(...heights, ...heights.map((h, i) => h + waterDetails[i]), 1);
        const unitSize = 35; // Size of each grid cell in pixels
        const width = n * unitSize;
        const height = (maxH + 1) * unitSize;

        let svgHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="250">`;

        // Draw background grid lines for aesthetic appeal
        for (let i = 0; i <= n; i++) {
            svgHTML += `<line x1="${i * unitSize}" y1="0" x2="${i * unitSize}" y2="${height}" stroke="#f1f5f9" stroke-width="1" />`;
        }
        for (let j = 0; j <= maxH + 1; j++) {
            svgHTML += `<line x1="0" y1="${j * unitSize}" x2="${width}" y2="${j * unitSize}" stroke="#f1f5f9" stroke-width="1" />`;
        }

        // Draw blocks and water columns
        for (let i = 0; i < n; i++) {
            const x = i * unitSize;
            const h = heights[i];
            const w = waterDetails[i];

            // Render Solid Blocks (Yellow)
            if (h > 0) {
                const blockY = height - (h * unitSize);
                const blockH = h * unitSize;
                svgHTML += `<rect x="${x + 2}" y="${blockY}" width="${unitSize - 4}" height="${blockH}" fill="#eab308" rx="3" />`;
            }

            // Render Water Units (Blue)
            if (w > 0) {
                const waterY = height - ((h + w) * unitSize);
                const waterH = w * unitSize;
                svgHTML += `<rect x="${x + 2}" y="${waterY}" width="${unitSize - 4}" height="${waterH}" fill="#0ea5e9" opacity="0.85" rx="2" />`;
            }
        }

        svgHTML += `</svg>`;
        svgContainer.innerHTML = svgHTML;
    }

    function processAndRender() {
        const rawValue = arrayInput.value.trim();
        const heights = rawValue.split(',').map(item => {
            const num = parseInt(item.trim(), 10);
            return isNaN(num) ? 0 : num;
        });

        const { totalWater, waterDetails } = calculateWaterTank(heights);
        outputUnits.textContent = totalWater;
        renderSVG(heights, waterDetails);
    }

    visualizeBtn.addEventListener('click', processAndRender);
    
    resetBtn.addEventListener('click', () => {
        arrayInput.value = "0,4,0,0,0,6,0,6,4,0";
        processAndRender();
    });

    // Initial Render
    processAndRender();
});