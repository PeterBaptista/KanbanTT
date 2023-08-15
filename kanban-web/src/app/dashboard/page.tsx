'use client'

import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { AbsoluteCenter, Box, Button, Divider, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import * as React from 'react'
import { useState } from 'react'
import Chart from 'react-apexcharts'
import { Providers, useDataContext, useDataDispatch, useDataState } from '../providers';



const ChartComponent = () => {

    

    const [options, setOptions] = useState({
        chart: {
            id: 'apexchart-example'
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
    });

    const [series, setSeries] = useState([
        {
            name: 'series-1',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }
    ]);

    return (
        <Box>
            <Chart options={options} series={series} width={500} height={320} />
        </Box>
    );
};

export default function Home() {


    const { kanbanData } = useDataState();
    const dispatch = useDataDispatch();
    console.log("kanban dashboard ", kanbanData)

    
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
                
                <Divider  borderWidth="2px" marginBottom={5}/>

                <Flex justifyContent="center" alignItems="center">
                    <ChartComponent />
                </Flex>
                
            </main>
        </Providers>

        </>
    );


}
