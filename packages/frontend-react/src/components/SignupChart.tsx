import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SignupData {
  date: string;
  users: number;
}

interface SignupChartProps {
  data: SignupData[];
}

export function SignupChart({ data }: SignupChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px] bg-base-100 rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-display font-bold text-primary mb-6">User Signups</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            strokeOpacity={0.1}
          />
          <XAxis
            dataKey="date"
            stroke="currentColor"
            strokeOpacity={0.5}
            tick={{ fill: 'currentColor', fillOpacity: 0.7 }}
          />
          <YAxis
            stroke="currentColor"
            strokeOpacity={0.5}
            tick={{ fill: 'currentColor', fillOpacity: 0.7 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--b1))',
              border: '1px solid hsl(var(--b3))',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: 'hsl(var(--p))' }}
            itemStyle={{ color: 'hsl(var(--p))' }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="hsl(var(--p))"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: 'hsl(var(--p))',
              strokeWidth: 2,
              stroke: 'hsl(var(--b1))',
            }}
            activeDot={{
              r: 6,
              fill: 'hsl(var(--p))',
              strokeWidth: 2,
              stroke: 'hsl(var(--b1))',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
} 