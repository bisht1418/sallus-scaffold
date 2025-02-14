import jsPDF from 'jspdf';
import 'jspdf-autotable';

const downloadPDF = (headers, filteredData, percentages, selectedScaffoldBase, totalHours, totalAmount) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Volume Based Price Report', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  // Prepare table data
  const tableData = filteredData?.map((item, index) => {
    const { scaffold, TotalHourJob, TotalAmount } = item;
    const buildAmount = ((percentages[index]?.build || 0) / 100) * (TotalAmount || 0);
    const dismantleAmount = ((percentages[index]?.dismantle || 0) / 100) * (TotalAmount || 0);
    const buildHour = ((percentages[index]?.build || 0) / 100) * (TotalHourJob || 0);
    const dismantleHour = ((percentages[index]?.dismantle || 0) / 100) * (TotalHourJob || 0);

    const row = [];
    
    headers.forEach(header => {
      if (header === "Scaffold Name") {
        row.push(scaffold?.key || "-");
        return;
      }

      // Handle measurements
      let normalizedType = header.toLowerCase();
      if (normalizedType === 'm²' || normalizedType === 'm^2') normalizedType = 'm2';
      if (normalizedType === 'm³' || normalizedType === 'm^3') normalizedType = 'm3';

      if (scaffold?.measurements && scaffold.measurements[normalizedType]) {
        const value = scaffold.measurements[normalizedType].reduce((acc, measurement) => {
          const length = parseFloat(measurement?.length || 0);
          const width = parseFloat(measurement?.width || 0);
          const height = parseFloat(measurement?.height || 0);

          switch (normalizedType) {
            case 'm3':
              return acc + (length * width * height);
            case 'm2':
              return acc + (length * width);
            case 'lm':
              return acc + length;
            case 'hm':
              return acc + height;
            default:
              return acc + (measurement?.value || 0);
          }
        }, 0);
        row.push(value.toFixed(2));
      } else if (header === "Total Hr") {
        row.push(TotalHourJob.toFixed(2));
      } else if (header === "Build Hr") {
        row.push(buildHour.toFixed(2));
      } else if (header === "Dismantle Hr") {
        row.push(dismantleHour.toFixed(2));
      } else if (header === "Total $") {
        row.push(TotalAmount.toFixed(2));
      } else if (header === "Build $") {
        row.push(buildAmount.toFixed(2));
      } else if (header === "Dismantle $") {
        row.push(dismantleAmount.toFixed(2));
      } else if (header === "Build %") {
        row.push(percentages[index]?.build || 0);
      } else if (header === "Dismantle %") {
        row.push(percentages[index]?.dismantle || 0);
      } else {
        row.push("0.00");
      }
    });

    return row;
  });

  // Add total row
  const totalRow = Array(headers.length).fill('');
  totalRow[headers.length - 2] = selectedScaffoldBase === "Hour Based" ? "Total Hours" : "Total Amount";
  totalRow[headers.length - 1] = selectedScaffoldBase === "Hour Based" 
    ? totalHours.toFixed(2) 
    : totalAmount.toFixed(2);

  // Configure the table
  const tableConfig = {
    head: [headers],
    body: [...tableData, totalRow],
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  };

  // Generate the table
  doc.autoTable(tableConfig);

  // Save the PDF
  doc.save('volume-based-price-report.pdf');
};

export default downloadPDF;