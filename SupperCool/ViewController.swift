//
//  ViewController.swift
//  SupperCool
//
//  Created by William Li on 7/3/16.
//  Copyright © 2016 William Li. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var coolLogo: UIImageView!
    @IBOutlet weak var coolBg:UIImageView!
    @IBOutlet weak var uncoolButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let ticketButton = UIButton(type: .System)
        ticketButton.setTitle("Buy Malcolm Todd Ticket", forState: .Normal)
        ticketButton.backgroundColor = UIColor(red: 0.18, green: 0.4, blue: 0.8, alpha: 1.0)
        ticketButton.setTitleColor(UIColor.whiteColor(), forState: .Normal)
        ticketButton.layer.cornerRadius = 8
        ticketButton.translatesAutoresizingMaskIntoConstraints = false
        ticketButton.addTarget(self, action: #selector(buyMalcolmToddTicket), forControlEvents: .TouchUpInside)
        view.addSubview(ticketButton)

        NSLayoutConstraint.activateConstraints([
            ticketButton.centerXAnchor.constraintEqualToAnchor(view.centerXAnchor),
            ticketButton.bottomAnchor.constraintEqualToAnchor(view.bottomAnchor, constant: -40),
            ticketButton.widthAnchor.constraintEqualToConstant(220),
            ticketButton.heightAnchor.constraintEqualToConstant(44),
        ])
    }

    @objc func buyMalcolmToddTicket() {
        let ticketVC = ConcertTicketViewController(ticket: ConcertTicket.malcolmTodd)
        presentViewController(ticketVC, animated: true, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func makeMeNotSoUncool(sender: AnyObject) {
        coolLogo.hidden=false
        coolBg.hidden = false
        uncoolButton.hidden = true
    }

}

