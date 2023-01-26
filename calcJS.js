const LabelInitialInvestmentAmount = document.querySelector(
  ".form__input--amount"
);
const LabelStakingPercentage = document.querySelector(
  ".form__input--percentage-amount"
);
const LabelStartDate = document.querySelector(".deposit-start");
const LabelEndDate = document.querySelector(".deposit-end");
const generateCSV = document.querySelector(".form__btn--close");

generateCSV.addEventListener("click", function (e) {
  e.preventDefault();
  

  const initialInvestmentAmount = Number(LabelInitialInvestmentAmount.value);
  const stakingPercentage = Number(LabelStakingPercentage.value) / 100;

  const startDate = new Date("2019-04-15");
  const endDate = new Date("2021-04-15");

  // let startDate;

  // LabelStartDate.addEventListener('input', function () {
  // 	console.log('Hi');
  //   startDate = new Date(LabelStartDate.value).toString();
  //   console.log(startDate);
  // });

  const paymentDay = 23;

  let totalStakingAmount = initialInvestmentAmount;
  let csvArray = [];
  csvArray.push(
    new Array(
      "Line #,Reward Date,Investment Amount,Reward Amount,Total Reward Amount To Date,Staking Reward Rate\n"
    )
  );
  let rewardPeriodStartDate = startDate;
  let rewardPeriodEndDate = getNextRewardDate(
    rewardPeriodStartDate,
    paymentDay
  );
  let totalReward = 0;
  let periodId = 1;

  while (true) {
    let daysDifference = calculateDateDiffreneceInDays(
      rewardPeriodStartDate,
      rewardPeriodEndDate
    );

    let periodReward =
      totalStakingAmount *
      (Math.pow(1 + stakingPercentage, 1 / 365) - 1) *
      daysDifference; 
    totalReward += periodReward;
    csvArray.push(
      new Array(
        periodId,
        formatDate(rewardPeriodEndDate, "yyyy-MM-dd"),
        totalStakingAmount.toFixed(6),
        periodReward.toFixed(6),
        totalReward.toFixed(6),
        `${(stakingPercentage * 100).toFixed(2)}%\n`
      )
    );

    //console.log(csvArray[periodId]);

    if (rewardPeriodEndDate === endDate) {
      break;
    }

    periodId++;
    rewardPeriodStartDate = rewardPeriodEndDate;
    rewardPeriodEndDate = getNextRewardDate(rewardPeriodStartDate, paymentDay);
    if (rewardPeriodEndDate > endDate) {
      rewardPeriodEndDate = endDate;
    }
    totalStakingAmount += periodReward;
  }

  downloadFile(csvArray);

  //console.log(calculateDateDiffreneceInDays(new Date("2022-01-01"), new Date("2022-01-02")));

  function calculateDateDiffreneceInDays(startDate, endDate) {
    return (endDate - startDate) / (1000 * 60 * 60 * 24);
  }

  function formatDate(dateToFormat, format) {
    switch (format) {
      case "yyyy-MM-dd":
        return `${dateToFormat.getFullYear()}-${dateToFormat.getMonth() + 1}-${dateToFormat.getDate()}`;
      default:
        return "unsupported format of date or if required this fucntion can be extended to support new formats.";
    }
  }

  function getNextRewardDate(inputDate, paymentDay) {
    let targetRewardDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      paymentDay
    );
    if (inputDate >= targetRewardDate) {
      targetRewardDate = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth() + 1,
        paymentDay
      );
    }
    /* targetRewardDate.setYear(inputDate.getYear());
  targetRewardDate.setMonth(inputDate.getMonth());
  targetRewardDate.setDate(23); */
    return targetRewardDate;
  }



  function downloadFile(csvDataArray) {
    const link = document.createElement("a");
    const file = new Blob(csvDataArray, {
      type: "text/csv",
    });
    link.href = URL.createObjectURL(file);
    link.download = "Staking_data_table.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
});
