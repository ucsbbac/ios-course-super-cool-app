//
//  ConcertTicket.swift
//  SupperCool
//

import Foundation

struct ConcertTicket {
    let artist: String
    let date: String
    let venue: String
    let price: Double
    var purchased: Bool

    static let malcolmTodd = ConcertTicket(
        artist: "Malcolm Todd",
        date: "October 28, 2026",
        venue: "TBD",
        price: 35.00,
        purchased: false
    )
}
