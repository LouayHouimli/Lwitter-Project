const formatPostDate = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    // Convert both dates to UTC
    const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - createdAtDate.getTime()) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    if (timeDifferenceInDays > 1) {
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (timeDifferenceInDays === 1) {
        return "1d";
    } else if (timeDifferenceInHours >= 1) {
        return `${timeDifferenceInHours}h`;
    } else if (timeDifferenceInMinutes >= 1) {
        return `${timeDifferenceInMinutes}m`;
    } else if (timeDifferenceInSeconds >= 1) {
        return `${timeDifferenceInSeconds}s`;
    } else {
        return "Just now";
    }
};
export default formatPostDate;