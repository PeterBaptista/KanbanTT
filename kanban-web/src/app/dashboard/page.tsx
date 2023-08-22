'use client'

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { AbsoluteCenter, Box, Button, Divider, Flex, HStack, Heading, Link, Radio, Stack, Text, UseRadioProps, useRadio, useRadioGroup } from '@chakra-ui/react';
import * as React from 'react'
import { useState } from 'react'
import Chart from 'react-apexcharts'
import { Providers, useDataDispatch, useDataState } from '../providers';
import { todo } from "node:test";
import { ApexOptions } from "apexcharts";


type columnTypes = "todo" | "inprogress" | "done"

interface TaskProps {
    id: string,
    type: columnTypes,
    content: string,
    important: boolean

}
type Kanban = {
    kanbanData: KanbanData
}

type KanbanTotal = {
    todoTotal: number,
    inProgressTotal: number,
    doneTotal: number
}
type KanbanData = {
    todoData: TaskProps[] | [],
    inProgressData: TaskProps[] | [],
    doneData: TaskProps[] | []
};

interface RadioCardProps extends UseRadioProps {
    children: React.ReactNode;
}


function RadioCard(props: RadioCardProps ) {
    const { getInputProps, getRadioProps } = useRadio(props)


    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='md'
                _checked={{
                    bg: 'teal.600',
                    color: 'white',
                    borderColor: 'white',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                px={5}
                py={3}
            >
                {props.children}
            </Box>
        </Box>
    )
}

const RadioCharts: React.FC<KanbanTotal> = ({ todoTotal, inProgressTotal, doneTotal }) => {
    const options = ['Pie', 'Line', 'Bar']
    const [selectedChart, setSelectedChart] = useState<string | null>(null);

    const kanbanSeries = [todoTotal, inProgressTotal, doneTotal]
    const kanbanLabels = ['To do', 'In Progress', 'Done']

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'chartType',
        defaultValue: 'Pie',
        onChange: (value) => setSelectedChart(value),
    });

    const group = getRootProps()

    const RenderChart = () => {

        const barOptions: ApexOptions = {
            series: [{
                name: "tasks",
                data: kanbanSeries
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            theme: {
                mode: 'dark', // Change mode to 'dark'
                palette: 'palette1'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: kanbanLabels,
            }
        };

        const lineOptions: ApexOptions = {
            series: [{
                name: "tasks",
                data: kanbanSeries
            }],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            theme: {
                mode: 'dark', // Change mode to 'dark'
                palette: 'palette1'
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Kanban Line Chart',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: kanbanLabels,
            }
        };

        const pieOptions: ApexOptions = {
            chart: {
                type: 'pie'
            },

            theme: {
                mode: 'dark', // Change mode to 'dark'
                palette: 'palette1'
            },

            labels: kanbanLabels,

            title: {
                text: 'Kanban Info'
            }
        };

        switch (selectedChart) {
            case 'Pie':
                return (
                    <ApexChart
                        // Set your pie chart options and series here
                        options={pieOptions} series={kanbanSeries} type="pie" height={445} width={600}

                    />
                );
            case 'Line':
                return (
                    <ApexChart
                        // Set your line chart options and series here
                        options={lineOptions} series={lineOptions.series} data={kanbanSeries} categories={kanbanLabels} type="line" height={450} width={600}

                    />
                );
            case 'Bar':
                return (
                    <ApexChart
                        // Set your bar chart options and series here
                        options={barOptions} series={barOptions.series} type="bar" xaxis={kanbanSeries} height={450} width={600}


                    />
                );
            default:
                return (
                    <ApexChart
                        // Set your pie chart options and series here
                        options={pieOptions} series={kanbanSeries} type="pie" height={445} width={600}

                    />
                );
        }
    };

    return (
        <>
            <HStack {...group} direction="column">
                {options.map((value) => {
                    const radio = getRadioProps({ value })
                    return (
                        <RadioCard key={value} {...radio}>
                            {value}
                        </RadioCard>
                    )
                })}
            </HStack>
            <RenderChart />
        </>
    );
};



const PieChart: React.FC<KanbanTotal> = ({ todoTotal, inProgressTotal, doneTotal }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'pie'
        },

        theme: {
            mode: 'dark', // Change mode to 'dark'
            palette: 'palette1'
        },

        labels: ['To do', 'In Progress', 'Done'],

        title: {
            text: 'Kanban Info'
        }
    };



    const chartSeries = [todoTotal, inProgressTotal, doneTotal]; // Corresponding values for each label

    return (
        <Box>
            <ApexChart options={chartOptions} series={chartSeries} type="pie" height={550} width={600} />
        </Box>
    );
};

export default function Home() {


    const { kanbanData } = useDataState();


    const todoTotal: number = kanbanData.todoData === undefined ? 0 : kanbanData.todoData.length
    const doneTotal: number = kanbanData.doneData === undefined ? 0 : kanbanData.doneData.length
    const inProgressTotal: number = kanbanData.inProgressData === undefined ? 0 : kanbanData.inProgressData.length

    const kanbanTotal = { todoTotal: todoTotal, inProgressTotal: inProgressTotal, doneTotal: doneTotal }

    return (

        <>
            <Providers>

                <main>


                    <Box as='header' position='relative' padding='7' display="flex" justifyContent="space-between">
                        <AbsoluteCenter px='4'>
                            <Heading>Projeto Dashboard</Heading>
                        </AbsoluteCenter>
                        <Stack direction='row' spacing={4}>
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline'>
                                <Link href='../'>KANBAN</ Link>
                            </Button>
                        </Stack>

                    </Box>

                    <Divider borderWidth="2px" marginBottom={5} />

                    <Flex justifyContent="space-around" alignItems="center">
                        <RadioCharts todoTotal={todoTotal} inProgressTotal={inProgressTotal} doneTotal={doneTotal} />
                    </Flex>



                </main>
            </Providers>


        </>
    );


}
