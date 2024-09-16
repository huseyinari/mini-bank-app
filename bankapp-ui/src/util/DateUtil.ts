import moment from "moment"

export const convertDate = (isoString: string): Date => {
    return moment(isoString).toDate();
}

const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const getTurkishString = (isoString: string): string => {
    const date = convertDate(isoString);

    const monthIndex = date.getMonth();
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const hour = date.getHours() <10 ? `0${date.getHours()}` : date.getHours();
    return `${date.getDate()} ${months[monthIndex]} ${date.getFullYear()} ${hour}:${minute}`
}