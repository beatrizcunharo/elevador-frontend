import React, { useEffect, useState, useCallback } from 'react';
import HistoricoService from '../../Service';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '30rem',
        height: '30rem',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        margin: '150px 0px 0px 650px',
        padding: theme.spacing(2, 4, 3)
    },
    table: {
        minWidth: 400
    },
    button: {
        marginBottom: '0.5rem',
        marginLeft: '11.0rem'
    }
}));

export const ModalComponent = () => {
    const classes = useStyles();
    const [historico, setHistorico] = useState([]);

    const fetchHistorico = useCallback(async () => {
        HistoricoService.buscarTodos()
            .then((response) => setHistorico(response.data))
            .catch((error) => console.error('Houve um erro ao buscar os dados do Histórico.', error));
    }, []);

    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

    return (
        <div className={classes.paper}>
            <Button className={classes.button} onClick={fetchHistorico} variant='contained' color='default'>
                Atualizar
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} size='small' aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Andar</TableCell>
                            <TableCell align='center'>Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historico.map((hist) => (
                            <TableRow key={hist.id}>
                                <TableCell align='center'>{hist.andar}</TableCell>
                                <TableCell align='center'>{new Date(hist.data).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
