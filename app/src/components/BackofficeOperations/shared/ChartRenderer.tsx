import {
  BarChart, Bar,
  LineChart as RechartsLineChart, Line,
  PieChart as RechartsPieChart, Pie,
  AreaChart as RechartsAreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { CHART_COLORS } from '../data';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ChartRendererProps {
  data: ChartDataPoint[];
  chartType: ChartType;
  yAxisLabel?: string;
  height?: number | `${number}%`;
}

export default function ChartRenderer({
  data,
  chartType,
  yAxisLabel = 'Value',
  height = '100%' as `${number}%`,
}: ChartRendererProps) {
  const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '8px',
  };

  const axisTickStyle = { fill: '#94a3b8', fontSize: 11 };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === 'bar' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Bar dataKey="value" name={yAxisLabel} fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : chartType === 'line' ? (
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Line type="monotone" dataKey="value" name={yAxisLabel} stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
        </RechartsLineChart>
      ) : chartType === 'area' ? (
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Area type="monotone" dataKey="value" name={yAxisLabel} stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
        </RechartsAreaChart>
      ) : (
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            outerRadius={200}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
        </RechartsPieChart>
      )}
    </ResponsiveContainer>
  );
}
