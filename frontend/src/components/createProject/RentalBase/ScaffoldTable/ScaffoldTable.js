import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";
import { calculateDaysBetween, formatCurrency } from '../Helpers/Helpers';

export const ScaffoldTable = ({ scaffolds, dateRange, prices }) => {


    const calculateRentalCost = (scaffold, startDate, endDate) => {
        const days = calculateDaysBetween(
            startDate,
            endDate || new Date()
        );

        const scaffoldPrice = prices[scaffold.type];
        const measurements = scaffold.measurements;

        let total = 0;
        if (measurements.m2 > 0) total += measurements.m2 * scaffoldPrice.pricePerM2 * days;
        if (measurements.m3 > 0) total += measurements.m3 * scaffoldPrice.pricePerM3 * days;
        if (measurements.lm > 0) total += measurements.lm * scaffoldPrice.pricePerLM * days;
        if (measurements.hm > 0) total += measurements.hm * scaffoldPrice.pricePerHM * days;

        return total;
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom className="mb-6">
                Scaffold Overview Section
            </Typography>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Scaffold ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Build Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Dismantle Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Days</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Volume</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Daily Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scaffolds.map((scaffold) => {
                        const rentalDays = calculateDaysBetween(
                            dateRange.startDate,
                            dateRange.endDate || new Date()
                        );
                        const totalCost = calculateRentalCost(
                            scaffold,
                            dateRange.startDate,
                            dateRange.endDate
                        );

                        return (
                            <TableRow
                                key={scaffold.id}
                                sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}
                            >
                                <TableCell>{scaffold.id}</TableCell>
                                <TableCell>{scaffold.type}</TableCell>
                                <TableCell>{scaffold.position}</TableCell>
                                <TableCell>{new Date(scaffold.buildDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {scaffold.dismantleDate
                                        ? new Date(scaffold.dismantleDate).toLocaleDateString()
                                        : 'Ongoing'}
                                </TableCell>
                                <TableCell>{rentalDays}</TableCell>
                                <TableCell>
                                    {Object.entries(scaffold.measurements)
                                        .filter(([_, value]) => value > 0)
                                        .map(([key, value]) => `${value} ${key}`)
                                        .join(', ')}
                                </TableCell>
                                <TableCell>
                                    {Object.entries(prices[scaffold.type])
                                        .filter(([key, _]) =>
                                            scaffold.measurements[key.replace('pricePer', '').toLowerCase()] > 0
                                        )
                                        .map(([_, price]) => formatCurrency(price))
                                        .join(', ')}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>
                                    {formatCurrency(totalCost)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow sx={{
                        backgroundColor: '#f5f5f5',
                        '& > td': { fontWeight: 'bold' }
                    }}>
                        <TableCell colSpan={8} align="right">Total:</TableCell>
                        <TableCell>
                            {formatCurrency(
                                scaffolds.reduce((total, scaffold) =>
                                    total + calculateRentalCost(
                                        scaffold,
                                        dateRange.startDate,
                                        dateRange.endDate
                                    ),
                                    0
                                )
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};