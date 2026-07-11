// LoopsTutorial.swift
//
// Run it:
//   swift Tutorials/LoopsTutorial.swift
// ...or paste the whole file into a new Xcode Playground (File > New > Playground)
// and watch the results in the results sidebar / console.
//
// Every example prints its own output, so you can run the whole file and read
// top to bottom, or comment out functions at the bottom to isolate one example.

import Foundation

// MARK: - 1. for-in over a range — paging through onboarding screens

func example1_forInRange() {
    print("\n--- Example 1: for-in over a range ---")
    let totalOnboardingScreens = 4
    for screenIndex in 0..<totalOnboardingScreens {
        print("Showing onboarding screen \(screenIndex + 1) of \(totalOnboardingScreens)")
    }
}

// MARK: - 2. for-in over a collection — rendering a list of app features

func example2_forInCollection() {
    print("\n--- Example 2: for-in over an array ---")
    let featureFlags = ["darkMode", "pushNotifications", "offlineSync"]
    for flag in featureFlags {
        print("Checking feature flag: \(flag)")
    }
}

// MARK: - 3. for-in with a where clause — filtering while you iterate

func example3_forInWhere() {
    print("\n--- Example 3: for-in with `where` ---")
    let downloadSizesMB = [12, 340, 8, 512, 45]
    for size in downloadSizesMB where size > 100 {
        print("\(size)MB asset needs a Wi-Fi-only download warning")
    }
}

// MARK: - 4. while — retrying a flaky network call up to a limit

func example4_whileRetry() {
    print("\n--- Example 4: while (retry loop) ---")
    var attempt = 0
    let maxAttempts = 3
    var succeeded = false
    while attempt < maxAttempts && !succeeded {
        attempt += 1
        succeeded = attempt == 3 // pretend the call finally succeeds on try 3
        print("Attempt \(attempt): \(succeeded ? "success" : "failed, retrying...")")
    }
}

// MARK: - 5. repeat-while — a form field that must be validated at least once

func example5_repeatWhile() {
    print("\n--- Example 5: repeat-while (validate at least once) ---")
    let candidatePasswords = ["abc", "abcdefgh"]
    var index = 0
    var password = ""
    repeat {
        password = candidatePasswords[index]
        print("Validating password candidate: \"\(password)\"")
        index += 1
    } while password.count < 8 && index < candidatePasswords.count
    print(password.count >= 8 ? "Password accepted" : "No valid password found")
}

// MARK: - 6. break / continue / labeled loops — scanning a 2D game board

func example6_breakContinueLabeled() {
    print("\n--- Example 6: break, continue, labeled loops ---")
    // 0 = empty, 1 = player, 2 = opponent
    let board = [
        [0, 2, 0],
        [1, 1, 1],
        [2, 0, 0],
    ]

    rowLoop: for (rowIndex, row) in board.enumerated() {
        for (colIndex, cell) in row.enumerated() {
            if cell == 0 {
                continue // empty cell, nothing to check
            }
            if cell == 1 && colIndex == row.count - 1 {
                print("Found a winning row at row \(rowIndex): \(row)")
                break rowLoop // stop scanning entirely, we found the win
            }
        }
    }
}

// MARK: - 7. forEach — running a side effect for every item

func example7_forEach() {
    print("\n--- Example 7: forEach ---")
    let pendingUploads = ["photo1.jpg", "photo2.jpg", "video1.mov"]
    pendingUploads.forEach { fileName in
        print("Uploading \(fileName)...")
    }
}

// MARK: - 8. map / filter / reduce — transforming a list of user records

struct User {
    let name: String
    let ageInDays: Int
}

func example8_mapFilterReduce() {
    print("\n--- Example 8: map, filter, reduce ---")
    let users = [
        User(name: "Ann", ageInDays: 400),
        User(name: "Bo", ageInDays: 20),
        User(name: "Cy", ageInDays: 900),
    ]

    let names = users.map { $0.name }
    print("All usernames: \(names)")

    let veterans = users.filter { $0.ageInDays > 365 }
    print("Users older than a year: \(veterans.map { $0.name })")

    let totalDays = users.reduce(0) { runningTotal, user in runningTotal + user.ageInDays }
    print("Combined account age across all users: \(totalDays) days")
}

// MARK: - 9. Bridging to automation — a tiny "daily task runner"
//
// This mirrors what Claude Code's /loop does at a much bigger scale: a fixed
// list of tasks gets walked on some cadence. See LOOPS_TUTORIAL.md Part 2.

struct DailyTask {
    let name: String
    var isDone: Bool = false
}

func example9_dailyTaskRunner() {
    print("\n--- Example 9: daily task runner ---")
    var tasks = [
        DailyTask(name: "Sync remote config"),
        DailyTask(name: "Check crash reports"),
        DailyTask(name: "Post build health summary"),
    ]

    for index in tasks.indices {
        print("Running task: \(tasks[index].name)")
        tasks[index].isDone = true
    }

    let remaining = tasks.filter { !$0.isDone }.count
    print("Daily run complete. \(remaining) tasks left incomplete.")
}

// MARK: - Run everything

example1_forInRange()
example2_forInCollection()
example3_forInWhere()
example4_whileRetry()
example5_repeatWhile()
example6_breakContinueLabeled()
example7_forEach()
example8_mapFilterReduce()
example9_dailyTaskRunner()
