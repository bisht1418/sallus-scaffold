'use client';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
} from '@mui/material';

export default function PriceTable({ projectId, headers, rentData, loading }) {
    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom className="mb-6">
                Rent Price
            </Typography>

            <TableContainer component={Paper} className="shadow-md">
                <Table sx={{ minWidth: 650 }} aria-label="scaffold pricing table">
                    <TableHead>
                        <TableRow className="bg-gray-50">
                            {headers.map((header, index) => (
                                <TableCell key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : rentData?.length > 0 ? (
                            rentData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    hover
                                >
                                    {/* Scaffold Name */}
                                    <TableCell component="th" scope="row">
                                        {item.scaffoldName}
                                    </TableCell>

                                    {/* Prices for each header */}
                                    {headers
                                        .slice(1) // Skip the "Scaffold Name" column
                                        .map((header) => {
                                            // Extract the key from the header (e.g., "Price (Kg)" -> "Kg")
                                            const key = header.match(/\(([^)]+)\)/)?.[1];

                                            return (
                                                <TableCell key={`${item.id}-${key}`} align="left">
                                                    {key && item.prices?.[key]
                                                        ? `$ ${item.prices[key]} /day`
                                                        : '-'} {/* Default to '-' if key is missing */}
                                                </TableCell>
                                            );
                                        })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
