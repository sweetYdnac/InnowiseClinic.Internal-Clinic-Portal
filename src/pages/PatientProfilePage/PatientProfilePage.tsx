import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { useState } from 'react';
import { Roles } from '../../constants/Roles';
import { useAppSelector } from '../../hooks/store';
import { selectRole } from '../../store/roleSlice';
import { PatientHistory } from './PatientHistory/PatientHistory';
import { PatientInformation } from './PatientInformation/PatientInformation';

type PatientProfileTab = 'information' | 'history';

export const PatientProfilePage = () => {
    const [activeTab, setActiveTab] = useState<PatientProfileTab>('information');
    const role = useAppSelector(selectRole);

    const handleChangeTab = (e: React.SyntheticEvent<Element, Event>, value: PatientProfileTab) => setActiveTab(value);

    return (
        <TabContext value={activeTab}>
            <TabList onChange={handleChangeTab} variant='fullWidth'>
                <Tab label={'Personal information'} value={'information' as PatientProfileTab} />
                {role === Roles.Doctor && <Tab label={'Appointment results'} value={'history' as PatientProfileTab} />}
            </TabList>
            <TabPanel value={'information' as PatientProfileTab}>
                <PatientInformation />
            </TabPanel>
            {role === Roles.Doctor && (
                <TabPanel value={'history' as PatientProfileTab}>
                    <PatientHistory />
                </TabPanel>
            )}
        </TabContext>
    );
};
