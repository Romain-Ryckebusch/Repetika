import React from 'react';
import { View, Text} from 'react-native';
import globalStyles from "../../styles/global";
import * as Progress from 'react-native-progress';
import styles from '../../styles/navigation/TopBar.style';

const DefaultHeader = ({ progress }) => {
    return (
        <View style={styles.container}>
            <Progress.Bar
                style={globalStyles.card_progressbar}
                height={15}
                color="#0dc800"
                unfilledColor="#d9d9d9"
                borderWidth={0}
                progress={progress/100}
                width={321}
            />
            <Text>51</Text>
        </View>
    );
};

export default DefaultHeader;

