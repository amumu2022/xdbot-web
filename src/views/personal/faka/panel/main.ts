export function groupOrdersByDate(
  orders: any,
  Month: boolean
): [string, number][] {
  // 将每日订单统计累加
  const orderCountByDate: { [date: string]: number } = {};

  for (const order of orders) {
    if (order.result === "已完成") {
      const date = order.update_time.split("T")[0];

      if (orderCountByDate[date]) {
        orderCountByDate[date]++;
      } else {
        orderCountByDate[date] = 1;
      }
    }
  }
  const totalPriceData: [string, number][] = [];

  const currentDate = new Date(); // 当前日期\
  currentDate.setHours(0, 0, 0, 0); // 将时间部分设为0，只保留日期
  let RealDays = 30;
  if (!Month) {
    RealDays = 6;
  }
  for (let i = RealDays; i >= 0; i--) {
    const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split("T")[0];

    const totalPrice = orderCountByDate[dateString] || 0;
    totalPriceData.push([dateString, totalPrice]);
  }

  const _data = totalPriceData.map(([date, count]) => [date, count]) as [
    string,
    number
  ][];

  return _data;
}

export function calculateTotalPriceByDate(
  orders: any,
  Month: boolean
): [string, number][] {
  const totalPriceByDate: { [date: string]: number } = {};
  for (const order of orders) {
    if (order.result == "已完成") {
      const date = order.update_time.split("T")[0];
      const price =
        order.data.price !== null ? parseFloat(order.data.price) : 0;

      if (totalPriceByDate[date]) {
        totalPriceByDate[date] += price;
      } else {
        totalPriceByDate[date] = price;
      }
    }
  }
  const totalPriceData: [string, number][] = [];

  const currentDate = new Date(); // 当前日期\
  currentDate.setHours(0, 0, 0, 0); // 将时间部分设为0，只保留日期
  let RealDays = 30;
  if (!Month) {
    RealDays = 6;
  }
  for (let i = RealDays; i >= 0; i--) {
    const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split("T")[0];

    const totalPrice = totalPriceByDate[dateString] || 0;
    totalPriceData.push([dateString, totalPrice]);
  }
  return totalPriceData;
}
