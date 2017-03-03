import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._

class CyaSimulation extends Simulation {

  val splitPosition = sys.env("BASE_URL").lastIndexOf("/")
  val baseUrl = sys.env("BASE_URL").substring(0, splitPosition)
  val appPath = sys.env("BASE_URL").substring(splitPosition)
  val users = sys.env("USERS").toInt
  val time = sys.env("RAMP_UP_TIME").toInt

  val httpProtocol = http
    .baseURL(baseUrl)
    .inferHtmlResources(BlackList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.(t|o)tf""", """.*\.png"""), WhiteList())
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-GB,en;q=0.5")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:43.0) Gecko/20100101 Firefox/43.0")

  val postHeaders = Map("Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

  val refIdFeeder = Iterator.continually(Map("refId" -> java.util.UUID.randomUUID.toString))

  val activityUrl = s"$appPath/$${refId}/activities/ACT-$${activityIndex}/categorise"

  val scn = scenario("CyaSimulation")
    .feed(refIdFeeder)
    .exec(http("introduction")
      .get(s"$appPath/$${refId}/introduction"))
    .pause(2)
    .exec(http("dashboard unsorted")
      .get(s"$appPath/$${refId}/activities/unsorted")
      .check(css("ul > li").count.transform(c => c+1).saveAs("numberOfActivities")))
    .pause(2)
    .repeat("${numberOfActivities}", "activityIndex") {
      exec(http("show activity")
        .get(activityUrl))
        .pause(1)
        .exec(http("complete activity")
          .post(activityUrl)
          .headers(postHeaders)
          .formParam("category", "DOING"))
        .pause(1)
    }
    .pause(2)
    .exec(http("dashboard - all activities completed")
      .get(s"$appPath/$${refId}/activities/unsorted")
      .check(substring("You've sorted all of the activities").exists))
    .pause(2)
    .exec(http("dashboard - sorted")
      .get(s"$appPath/$${refId}/activities/sorted"))

  setUp(scn.inject(rampUsers(users) over (time seconds))).protocols(httpProtocol)
}