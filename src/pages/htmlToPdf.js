import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function getPdf(elementId, pdfName) {
    const element = document.getElementById(elementId);

    // 格式化时间函数 - 生成如 "2026-01-23 15:30:45" 格式的时间
    const formatDateTime = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 获取格式化后的当前时间
    const currentTime = formatDateTime();

    html2canvas(element, {
        useCORS: true, // 允许跨域请求外部链接图片
        allowTaint: true // 允许canvas污染
    }).then(canvas => {
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        const pageHeight = contentWidth / 592.28 * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        const imgWidth = 595.28;
        const imgHeight = (contentHeight * imgWidth) / contentWidth;

        const pageData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF('', 'pt', 'a4');

        if (leftHeight < pageHeight) {
            // 单页PDF逻辑
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            // 在 pdf.text() 前添加以下代码
            pdf.setFontSize(8); // 字体大小

            pdf.text(currentTime, 20, 20); // 左上角添加时间
        } else {
            // 多页PDF逻辑 - 重新设计循环逻辑，确保每页都添加时间
            while (leftHeight > 0) {
                // 绘制当前页的内容
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                // 🔥 关键修复：直接使用固定坐标20,20，每个新页面都在左上角显示时间
                // 在 pdf.text() 前添加以下代码
                pdf.setFontSize(8); // 字体大小

                pdf.text(currentTime, 20, 20);

                leftHeight -= pageHeight;
                position -= 841.89;

                // 如果还有剩余内容，新增页面
                if (leftHeight > 0) {
                    pdf.addPage();
                }
            }
        }

        pdf.save(pdfName + '.pdf');
    }).catch(error => {
        console.error('Error during PDF generation:', error);
    });
}