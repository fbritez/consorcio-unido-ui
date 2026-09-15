import React, { useState, useCallback, useContext } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
    Alert
} from '@mui/material';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { FileUploaderButton } from '../../common/buttons';
import FileSelectedItem from '../../utils/file-selected-ite';

const service = new ExpensesReceiptService();

const ExpensesItemView = (props) => {
    const { item, actionDescription, show, showExpensesCRUD, handleAction } = props;
    const { consortium } = useContext(ConsortiumContext);
    const isDeleteAction = actionDescription === 'Eliminar';

    const [tabValue, setTabValue] = useState('general');
    const [gridApi, setGridApi] = useState(null);
    const [formData, setFormData] = useState(() =>
        item ? { ...item } : { title: '', description: '', amount: '', ticket: null }
    );
    const [selectedFile, setSelectedFile] = useState({ name: item?.ticket });
    const [selectedMembers, setSelectedMembers] = useState(() => item?.members || []);
    const [errors, setErrors] = useState({});

    const handleGridReady = useCallback((params) => {
        setGridApi(params.api);
        if (consortium?.members) {
            params.api.setRowData(consortium.members);
            params.api.forEachNode((node) => {
                const isSelected = selectedMembers.some(
                    (member) => member.member_name === node.data.member_name
                );
                node.setSelected(isSelected);
            });
        }
    }, [consortium?.members, selectedMembers]);

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
        handleFormChange('ticket', file.name);
    };

    const handleFileRemove = () => {
        setSelectedFile({});
        handleFormChange('ticket', null);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
        if (!formData.amount || formData.amount <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const selectedNodes = gridApi?.getSelectedNodes() || [];
        const members = selectedNodes.map((node) => node.data);

        const itemToSave = service.createItemModel({
            ...formData,
            members: members.length > 0 ? members : []
        });

        handleAction({
            newItem: { item: itemToSave, updatedFile: selectedFile },
            oldItem: item
        });

        handleClose();
    };

    const handleClose = () => {
        showExpensesCRUD(false);
        setFormData(item ? { ...item } : { title: '', description: '', amount: '', ticket: null });
        setSelectedMembers(item?.members || []);
        setErrors({});
        setTabValue('general');
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{
            sx: { borderRadius: 2 }
        }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem', bgcolor: 'primary.main', color: 'white' }}>
                {actionDescription} Gasto
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Información General" value="general" />
                    <Tab label="Unidades Funcionales" value="members" />
                </Tabs>

                {tabValue === 'general' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Título"
                            fullWidth
                            value={formData.title || ''}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            disabled={isDeleteAction}
                            error={!!errors.title}
                            helperText={errors.title}
                            variant="outlined"
                            size="small"
                        />

                        <TextField
                            label="Monto"
                            type="number"
                            fullWidth
                            value={formData.amount || ''}
                            onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || '')}
                            disabled={isDeleteAction}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            inputProps={{ step: '0.01', min: '0' }}
                            variant="outlined"
                            size="small"
                        />

                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description || ''}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            disabled={isDeleteAction}
                            variant="outlined"
                            size="small"
                        />

                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Comprobante
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <FileUploaderButton
                                    handleFile={handleFileChange}
                                    disabled={isDeleteAction}
                                />
                                {selectedFile?.name && (
                                    <FileSelectedItem
                                        selectedFile={selectedFile}
                                        setSelectedFile={handleFileRemove}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}

                {tabValue === 'members' && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Selecciona las unidades funcionales a las que se asigna este gasto. Si no seleccionas ninguna, se aplicará a todo el consorcio.
                        </Alert>
                        <Paper sx={{ height: 350, bgcolor: '#fafafa' }}>
                            <div className="ag-theme-material" style={{ height: '100%' }}>
                                <AgGridReact
                                    defaultColDef={{
                                        enableRowGroup: false,
                                        sortable: true,
                                        resizable: true,
                                        filter: true,
                                        flex: 1,
                                        minWidth: 100,
                                    }}
                                    rowData={consortium?.members || []}
                                    rowSelection="multiple"
                                    pagination={true}
                                    paginationPageSize={5}
                                    suppressColumnsToolPanel={true}
                                    suppressMovableColumns={true}
                                    onGridReady={handleGridReady}
                                >
                                    <AgGridColumn
                                        checkboxSelection={true}
                                        headerName="Seleccionar"
                                        width={80}
                                        sortable={false}
                                        filter={false}
                                    />
                                    <AgGridColumn
                                        field="member_name"
                                        headerName="Unidad Funcional"
                                    />
                                    <AgGridColumn
                                        field="user_email"
                                        headerName="Email de Contacto"
                                    />
                                </AgGridReact>
                            </div>
                        </Paper>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ borderRadius: 1 }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isDeleteAction}
                    sx={{
                        borderRadius: 1,
                        backgroundColor: isDeleteAction ? '#d32f2f' : 'primary.main',
                        '&:hover': {
                            backgroundColor: isDeleteAction ? '#b71c1c' : 'primary.dark'
                        }
                    }}
                >
                    {actionDescription}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpensesItemView;
