export default function (amount: number) {
    return formatter.format(amount);
}

export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
})
