import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const DeviceStats = ({ stats }) => {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0
    }

    acc[item.device]++
    return acc
  }, {})

  console.log(deviceCount)

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }))

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <PieChart width={400} height={400}>
        <Pie
          data={result}
          dataKey='count'
          labelLine={false}
          label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}>
          {result.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default DeviceStats
