import { yupResolver } from '@hookform/resolvers/yup';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button, TablePagination } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { dateViewFormat, timeViewFormat } from '../../../constants/Formats';
import { useGetPatientHistoryQuery } from '../../../hooks/requests/appointments';
import { usePatientHistoryValidator } from '../../../hooks/validators/appointments/patientHistory';
import { IPagedRequest } from '../../../types/common/Requests';
import { StyledPatientHistoryRow } from './PatientHistory.styles';
import { PatientHistoryTableHeader } from './data/patientHistoryTableHeader';

export const PatientHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { initialValues, validationScheme } = usePatientHistoryValidator({ currentPage: 1, pageSize: 10 } as IPagedRequest);
    const { setValue, watch } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: history, isFetching: isFetchingHistory } = useGetPatientHistoryQuery(id as string, watch(), true);

    const handleAppointmentResultClick = useCallback(
        (resultId: string) => navigate(AppRoutes.AppointmentResult.replace(':id', `${resultId}`)),
        [navigate]
    );

    const handlePageChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => setValue('currentPage', page + 1),
        [setValue]
    );

    return (
        <>
            <CustomTable
                header={
                    <>
                        {PatientHistoryTableHeader.map((title) => (
                            <CustomCell key={title}>{title}</CustomCell>
                        ))}
                    </>
                }
            >
                {history &&
                    history.items.map((item) => (
                        <StyledPatientHistoryRow key={item.id} hover>
                            <CustomCell>{item.date.format(dateViewFormat)}</CustomCell>
                            <CustomCell>{`${item.startTime.format(timeViewFormat)} - ${item.endTime.format(timeViewFormat)}`}</CustomCell>
                            <CustomCell>{item.doctorFullName}</CustomCell>
                            <CustomCell>{item.serviceName}</CustomCell>
                            <CustomCell>
                                <Button onClick={() => handleAppointmentResultClick(item.resultId as string)}>
                                    View result
                                    <DescriptionIcon fontSize='medium' />
                                </Button>
                            </CustomCell>
                        </StyledPatientHistoryRow>
                    ))}
            </CustomTable>

            {history && (
                <TablePagination
                    component='div'
                    count={history.totalCount}
                    rowsPerPage={history.totalPages}
                    page={history.currentPage - 1}
                    rowsPerPageOptions={[]}
                    onPageChange={handlePageChange}
                />
            )}

            {isFetchingHistory && <Loader />}
        </>
    );
};
