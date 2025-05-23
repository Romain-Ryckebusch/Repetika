import { View, Text, ScrollView } from "react-native";
import ScreenWrapper from "../components/navigation/screenWrapper";
import { useTranslation } from "react-i18next";
import globalStyles from "../styles/global";

import styles from "../styles/StatisticsScreen.style";
import { BarChart, PieChart } from 'react-native-chart-kit';

const data_rev = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const data_stab = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      data: [100, 50, 25, 12, 6, 3],
    },
  ],
};

const pieData = [
  {
    name: 'Révision',
    population: 40,
    color: '#007AFF',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Stabilité',
    population: 30,
    color: '#34C759',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Autres',
    population: 30,
    color: '#FF9500',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];


const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};



export default function StatisticsScreen() {
    const {t}=useTranslation();

    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    
                    <Text style={globalStyles.title}>{t('StatisticsScreen.title')}</Text>

                    <Text style={globalStyles.subtitle}>{t('StatisticsScreen.section_rev')}</Text>
                    <BarChart
                        style={styles.barChart}
                        data={data_rev}
                        width={320}
                        height={220}
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero
                    />


                    <Text style={globalStyles.subtitle}>{t('StatisticsScreen.section_stab')}</Text>
                    <BarChart
                        style={styles.barChart}
                        data={data_stab}
                        width={320}
                        height={220}
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero
                    />


                    <Text style={globalStyles.subtitle}>{t('StatisticsScreen.section_numbercards')}</Text>
                    <PieChart
                        data={pieData}
                        width={320}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={'population'}
                        backgroundColor={'transparent'}
                        paddingLeft={'15'}
                        absolute
                    />

                    <View style={styles.corpus_container}>
                        <Text style={styles.infos}>{t('StatisticsScreen.cards_day', { cards_day: 10 })}</Text>
                        <Text style={styles.infos}>{t('StatisticsScreen.cards_week', { cards_week: 10 })}</Text>
                        <Text style={styles.infos}>{t('StatisticsScreen.cards_month', { cards_month: 10 })}</Text>
                        <Text style={styles.infos}>{t('StatisticsScreen.cards_year', { cards_year: 10 })}</Text>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}