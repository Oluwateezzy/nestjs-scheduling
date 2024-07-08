import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(private scheduleRegistry: SchedulerRegistry) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug('Called when the current second is 10')
  }

  @Cron('45 * * * * *')
  handleCronEvery45sec() {
    this.logger.debug('Called when the current second is 45')
  }

  @Interval(2000)
  handleInterval() {
    this.logger.debug('Called every 2 secs')
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 secs')
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.scheduleRegistry.addCronJob(name, job)
    job.start()

    this.logger.warn(`jobs ${name} added for each minute at ${seconds} seconds`)
  }

  deleteCrons(name: string) {
    this.scheduleRegistry.deleteCronJob(name)
    this.logger.warn(`job ${name} deleted!`)
  }

  getCrons() {
    const jobs = this.scheduleRegistry.getCronJobs()
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate().toJSDate()
      } catch (error) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    })
  }
}
