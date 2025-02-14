'use client'

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'

const rows = [
    {
        id: '001',
        type: 'Standard Frame',
        size: '100 m²',
        position: 'North Wall',
        buildDate: '2024-01-01',
        dismantleDate: '(Not entered yet)',
    },
    {
        id: '002',
        type: 'Hanging Scaffold',
        size: '50 m³',
        position: 'East Side',
        buildDate: '2024-01-05',
        dismantleDate: '2024-01-20',
    },
    {
        id: '003',
        type: 'Mobile Tower',
        size: '75 m²',
        position: 'West Wing',
        buildDate: '2024-01-10',
        dismantleDate: '(Not entered yet)',
    },
]

export default function ApprovalForm() {
    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom className="mb-6">
                Scaffold Management
            </Typography>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="scaffold table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Scaffold ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Scaffold Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Size</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Position</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Build Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Dismantle Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.size}</TableCell>
                                <TableCell>{row.position}</TableCell>
                                <TableCell>{row.buildDate}</TableCell>
                                <TableCell>{row.dismantleDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

