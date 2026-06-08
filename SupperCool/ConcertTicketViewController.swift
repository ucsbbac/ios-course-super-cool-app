//
//  ConcertTicketViewController.swift
//  SupperCool
//

import UIKit

class ConcertTicketViewController: UIViewController {

    var ticket: ConcertTicket

    init(ticket: ConcertTicket) {
        self.ticket = ticket
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        view.backgroundColor = UIColor.whiteColor()

        let titleLabel = UILabel()
        titleLabel.text = "Concert Ticket"
        titleLabel.font = UIFont.boldSystemFontOfSize(24)
        titleLabel.textAlignment = .Center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)

        let artistLabel = UILabel()
        artistLabel.text = ticket.artist
        artistLabel.font = UIFont.boldSystemFontOfSize(22)
        artistLabel.textAlignment = .Center
        artistLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(artistLabel)

        let dateLabel = UILabel()
        dateLabel.text = ticket.date
        dateLabel.font = UIFont.systemFontOfSize(18)
        dateLabel.textAlignment = .Center
        dateLabel.textColor = UIColor.grayColor()
        dateLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(dateLabel)

        let priceLabel = UILabel()
        priceLabel.text = String(format: "$%.2f", ticket.price)
        priceLabel.font = UIFont.systemFontOfSize(18)
        priceLabel.textAlignment = .Center
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(priceLabel)

        let buyButton = UIButton(type: .System)
        buyButton.setTitle("Confirm Purchase", forState: .Normal)
        buyButton.backgroundColor = UIColor(red: 0.18, green: 0.6, blue: 0.18, alpha: 1.0)
        buyButton.setTitleColor(UIColor.whiteColor(), forState: .Normal)
        buyButton.layer.cornerRadius = 8
        buyButton.translatesAutoresizingMaskIntoConstraints = false
        buyButton.addTarget(self, action: #selector(confirmPurchase), forControlEvents: .TouchUpInside)
        view.addSubview(buyButton)

        let cancelButton = UIButton(type: .System)
        cancelButton.setTitle("Cancel", forState: .Normal)
        cancelButton.translatesAutoresizingMaskIntoConstraints = false
        cancelButton.addTarget(self, action: #selector(cancel), forControlEvents: .TouchUpInside)
        view.addSubview(cancelButton)

        NSLayoutConstraint.activateConstraints([
            titleLabel.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            titleLabel.topAnchor.constraintEqualToAnchor(view.topAnchor, constant: 80),

            artistLabel.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            artistLabel.topAnchor.constraintEqualToAnchor(titleLabel.bottomAnchor, constant: 24),

            dateLabel.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            dateLabel.topAnchor.constraintEqualToAnchor(artistLabel.bottomAnchor, constant: 12),

            priceLabel.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            priceLabel.topAnchor.constraintEqualToAnchor(dateLabel.bottomAnchor, constant: 12),

            buyButton.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            buyButton.topAnchor.constraintEqualToAnchor(priceLabel.bottomAnchor, constant: 40),
            buyButton.widthAnchor.constraintEqualToConstant(200),
            buyButton.heightAnchor.constraintEqualToConstant(44),

            cancelButton.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            cancelButton.topAnchor.constraintEqualToAnchor(buyButton.bottomAnchor, constant: 16),
        ])
    }

    @objc func confirmPurchase() {
        ticket.purchased = true
        let alert = UIAlertController(
            title: "Ticket Purchased!",
            message: "You've successfully purchased a ticket to see \(ticket.artist) on \(ticket.date).",
            preferredStyle: .Alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .Default) { _ in
            self.dismissViewControllerAnimated(true, completion: nil)
        })
        presentViewController(alert, animated: true, completion: nil)
    }

    @objc func cancel() {
        dismissViewControllerAnimated(true, completion: nil)
    }
}
