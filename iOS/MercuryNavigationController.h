//
//  MercuryNavigationController.h
//  Mercury
//
//  Created by Sudhakar Moparthy on 12/10/11.
//  Copyright (c) 2011 AbbottWebDev. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MercuryNavigationController : UINavigationController
{
    UINavigationBar* customnavbar;
}

@property (nonatomic, retain) UINavigationBar* customnavbar;
@end
