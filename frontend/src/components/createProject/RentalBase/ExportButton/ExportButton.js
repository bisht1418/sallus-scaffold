import React from 'react';
import { Button } from '@mui/material';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export const ExportButtons = ({ scaffolds }) => {
    const formatDate = (dateString) => {
        if (!dateString || dateString === '(Not entered yet)') return '(Not entered yet)';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value).trim();
        if (stringValue.includes(',')) {
            return `"${stringValue.replace(/,/g, ', ')}"`;
        }
        return stringValue;
    };

    const exportCSV = () => {
        const headers = [
            'Scaffold ID',
            'Scaffold Type',
            'Position',
            'Build Date',
            'Dismantle Date',
            'Days',
            'Size/Volume',
            'Daily Price',
            'Total Price'
        ];

        const rows = scaffolds.map(row => {
            const days = calculateDaysDifference(row.buildDate, row.dismantleDate);
            const totalPrice = calculateTotalPrice(row.dailyPrice, row.size, days);

            return [
                row.id,
                formatScaffoldType(row.type),
                formatPosition(row.position),
                formatDate(row.buildDate),
                row.dismantleDate || '(Not entered yet)',
                `${days} days`,
                formatSize(row.size),
                formatCurrency(row.dailyPrice),
                formatCurrency(totalPrice)
            ].map(escapeCSV);
        });

        const grandTotal = scaffolds.reduce((total, row) => {
            const days = calculateDaysDifference(row.buildDate, row.dismantleDate);
            return total + calculateTotalPrice(row.dailyPrice, row.size, days);
        }, 0);

        rows.push(['', '', '', '', '', '', '', '', '']);
        rows.push([
            'Total:',
            '', '', '', '', '', '',
            '',
            formatCurrency(grandTotal)
        ].map(escapeCSV));

        const csvContent = [
            ['Scaffold Rent Periods Report'].map(escapeCSV).join(','),
            '',
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.join(','))
        ].join('\r\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], {
            type: 'text/csv;charset=utf-8'
        });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `scaffold_rent_periods_${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateDaysDifference = (buildDate, dismantleDate) => {
        if (!buildDate) return 0;
        const start = new Date(buildDate);
        const end = dismantleDate && dismantleDate !== '(Not entered yet)'
            ? new Date(dismantleDate)
            : new Date();
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const calculateTotalPrice = (dailyPrice, size, days) => {
        const extractNumber = (str) => {
            const match = String(str).match(/[\d.]+/);
            return match ? parseFloat(match[0]) : 0;
        };
        const numericSize = extractNumber(size);
        return dailyPrice * numericSize * days;
    };

    const formatSize = (size) => {
        if (!size) return '0';
        const sizeStr = size.toString();
        return sizeStr.replace(/(\d)(m[²A]|LM|HM)/g, '$1 $2');
    };

    const formatScaffoldType = (type) => {
        if (!type) return '';
        return type.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatPosition = (position) => {
        if (!position) return '';
        return position.split(',')
            .map(part => part.trim())
            .join(', ');
    };

    const formatCurrency = (amount) => {
        const value = Number(amount);
        if (isNaN(value)) return '$0.00';
        return `$${value.toFixed(2)}`;
    }; 

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Rent Period Selection', 14, 15);

        // Prepare table data
        const headers = [
            ['ID', 'Type', 'Position', 'Build Date', 'Dismantle Date', 'Days', 'Size', 'Daily Price', 'Total Price']
        ];

        const rows = scaffolds.map(row => {
            const days = calculateDaysDifference(row.buildDate, row.dismantleDate);
            const totalPrice = calculateTotalPrice(row.dailyPrice, row.size, days);

            return [
                row.id,
                row.type,
                row.position,
                row.buildDate,
                row.dismantleDate,
                `${days} days`,
                row.size,
                `$ ${row.dailyPrice.toFixed(2)}`,
                `$ ${totalPrice.toFixed(2)}`
            ];
        });

        // Add total row
        const grandTotal = scaffolds.reduce((total, row) => {
            const days = calculateDaysDifference(row.buildDate, row.dismantleDate);
            return total + calculateTotalPrice(row.dailyPrice, row.size, days);
        }, 0);

        rows.push(['', '', '', '', '', '', '', 'Total:', `$ ${grandTotal.toFixed(2)}`]);

        // Add table to document
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 25,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [69, 69, 69] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 25 }
        });

        // Save PDF
        doc.save('scaffold_rent_periods.pdf');
    };

    return (
        <div className="flex gap-4 justify-end p-4">
            <Button
                variant="outline"
                onClick={exportCSV}
                className="flex items-center gap-2"
            >
                <Download className="h-4 w-4" />
                Export CSV
            </Button>
            <Button
                onClick={exportPDF}
                className="flex items-center gap-2"
            >
                <Download className="h-4 w-4" />
                Export PDF
            </Button>
        </div>
    );
};